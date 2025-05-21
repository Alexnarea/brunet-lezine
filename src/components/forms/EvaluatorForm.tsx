import React from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { useAppStore } from '../../store';
import { tutorsService } from '../../services/tutors';

interface TutorFormProps {
  onSuccess?: () => void;
  initialValues?: any;
  mode?: 'create' | 'edit';
}

const TutorForm: React.FC<TutorFormProps> = ({
  onSuccess,
  initialValues,
  mode = 'create',
}) => {
  const [form] = Form.useForm();
  const { getLevels } = useAppStore();
  const levels = getLevels();

  const onFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        assignedLevels: levels.filter((l) =>
          values.assignedLevelIds.includes(l.id)
        ),
      };

      if (mode === 'edit') {
        delete payload.password; // No enviar contraseña en modo edición
        await tutorsService.update(initialValues.id, payload);
        message.success('Tutor actualizado exitosamente');
      } else {
        await tutorsService.create(payload);
        message.success('Tutor creado exitosamente');
      }

      form.resetFields();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      message.error('Error al guardar el tutor');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
        assignedLevelIds: initialValues?.assignedLevels?.map((l: any) => l.id),
      }}
      className="max-w-2xl mx-auto"
    >
      <Form.Item
        name="name"
        label="Nombre completo"
        rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Correo Electrónico"
        rules={[
          { required: true, message: 'Por favor ingrese el correo electrónico' },
          { type: 'email', message: 'Correo electrónico no válido' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Teléfono"
        rules={[{ required: true, message: 'Por favor ingrese el teléfono' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="specialization"
        label="Especialización"
        rules={[{ required: true, message: 'Por favor ingrese la especialización' }]}
      >
        <Input />
      </Form.Item>

      {mode === 'create' && (
        <Form.Item
          name="password"
          label="Contraseña"
          rules={[{ required: true, message: 'Por favor ingrese una contraseña' }]}
        >
          <Input.Password />
        </Form.Item>
      )}

      <Form.Item
        name="assignedLevelIds"
        label="Niveles Asignados"
        rules={[{ required: true, message: 'Seleccione al menos un nivel' }]}
      >
        <Select
          mode="multiple"
          placeholder="Seleccione los niveles"
          options={levels.map((level) => ({
            label: level.name,
            value: level.id,
          }))}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
          {mode === 'create' ? 'Crear Tutor' : 'Actualizar Tutor'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TutorForm;
